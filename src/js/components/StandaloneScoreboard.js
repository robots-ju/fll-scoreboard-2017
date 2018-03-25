import m from 'mithril';
import Scoreboard from './Scoreboard';
import FllScorer from 'robots-ju-fll-robotgame-scorer-2017';

export default {
    oninit(vnode) {
        vnode.state.missions = JSON.parse(JSON.stringify(FllScorer.initialMissionsState));


        if (window.location.hash) {
            try {
                const initialMissionsState = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));

                for (let attr in initialMissionsState) {
                    if (initialMissionsState.hasOwnProperty(attr) && vnode.state.missions.hasOwnProperty(attr)) {
                        vnode.state.missions[attr] = initialMissionsState[attr];
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }
    },
    view(vnode) {
        return m(Scoreboard, {
            missions: vnode.state.missions,
        });
    },
}
