import m from 'mithril';
import Scoreboard from './Scoreboard';
import FllScorer from 'robots-ju-fll-robotgame-scorer-2017';

export default {
    oninit(vnode) {
        vnode.state.missions = JSON.parse(JSON.stringify(FllScorer.initialMissionsState));

        if (vnode.attrs && vnode.attrs.initialMissionsState) {
            for (let attr in vnode.attrs.initialMissionsState) {
                if (vnode.attrs.initialMissionsState.hasOwnProperty(attr) && vnode.state.missions.hasOwnProperty(attr)) {
                    vnode.state.missions[attr] = vnode.attrs.initialMissionsState[attr];
                }
            }
        }
    },
    view(vnode) {
        return m(Scoreboard, {
            missions: vnode.state.missions,
        });
    },
}
