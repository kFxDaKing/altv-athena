import * as alt from 'alt-server';
import { View_Events_Creator } from '../../shared/enums/views';
import { Appearance } from '../../shared/interfaces/Appearance';

alt.onClient(View_Events_Creator.Done, handleCreatorDone);

/**
 * Called when a player pushes up Character Creator data.
 * @param  {alt.Player} player
 * @param  {Appearance} appearance
 */
function handleCreatorDone(player: alt.Player, appearance: Appearance) {
    if (!player.pendingCharacterEdit) {
        alt.log(`${player.name} | Attempted to edit a character when no edit was requested.`);
        return;
    }

    if (player.pendingNewCharacter) {
        player.pendingNewCharacter = false;
        player.createNewCharacter(appearance);
        return;
    }

    player.pendingCharacterEdit = false;
    player.updateDataByKeys(appearance, 'appearance');
    player.updateAppearance();

    // Resync Position After Appearance for Interior Bug
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        player.safeSetPosition(player.pos.x, player.pos.y, player.pos.z);
    }, 500);
}
