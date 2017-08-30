import m from 'mithril';
import trans from '../helpers/trans';
import OverlayTask from './OverlayTask';

export default {
    view(vnode)
    {
        const mission = vnode.attrs.mission;
        const missions = vnode.attrs.missions;

        const missionClass = () => {
            if (vnode.attrs.key === vnode.attrs.focused_mission) {
                return '';
            } else if(vnode.attrs.key > vnode.attrs.focused_mission) {
                return '--hidden-next';
            }

            return '--hidden-previous';
        };

        return m('.scoreboard__overlay__mission', {
            className: missionClass(),
        }, m('.content', [
            m('h1', (mission.number === null ? '' : ('M' + mission.number + ' ')) + trans(mission.title)),
            m('p', trans(mission.description)),
            m('.tasks', {
                className: mission.tasks.length > 1 ? ' multiple' : '',
            }, mission.tasks.map(
                (task, key) => m(OverlayTask, {
                    task,
                    key,
                    missions,
                })
            )),
            m('ul', mission.constraints.map(
                (constraint, key) => m('li', {
                    key,
                }, trans(constraint))
            )),
        ]));
    },
}
