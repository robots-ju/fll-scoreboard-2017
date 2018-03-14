import m from 'mithril';
import icon from '../helpers/icon';
import trans from '../helpers/trans';
import data from '../utils/data';
import FieldMission from './FieldMission';
import OverlayMission from './OverlayMission';
import FllScorer from 'robots-ju-fll-robotgame-scorer-2017';
import lang from '../helpers/lang';
import Configuration from '../utils/Configuration';

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

        // The index of the mission to display in extended format
        // If the viewport is large enough we open the first mission in the wizard
        vnode.state.focused_mission = window.innerWidth > Configuration.openOverlayWhenInnerWidthGreatherThan ? 0 : -1;

        vnode.state.focusMission = mission => {
            let newIndex = vnode.state.focused_mission;

            switch (mission) {
                case 'next':
                    if (newIndex < data.missions.length - 1) {
                        newIndex++;
                    } else {
                        newIndex = -1;
                    }
                    break;
                case 'prev':
                    if (newIndex > -1) {
                        newIndex--;
                    }
                    break;
                case 'close':
                    newIndex = -1;
                    break;
                default:
                    newIndex = mission;
            }

            vnode.state.focused_mission = newIndex;
        };
    },
    view(vnode) {
        const output = FllScorer.computeMissions(vnode.state.missions);
        const score = output.score;

        return [
            m('header.scoreboard__header', [
                m('.header-block.score', 'Score: ' + score),
                m('h1..scoreboard__header__title.header-block', [m('em', 'Robots-JU'), ' FLL 2017 Scoreboard']),
                m('.overlay-nav', {
                    className: vnode.state.focused_mission !== -1 ? ' active' : '',
                }, [
                    m('button.header-block.nav-prev', {
                        onclick() {
                            vnode.state.focusMission('prev');
                        },
                    }, [icon('chevron-left'), ' ', trans(data.strings.prev)]),
                    m('button.header-block.nav-next', {
                        onclick() {
                            vnode.state.focusMission('next');
                        },
                    }, [trans(data.strings.next), ' ', icon('chevron-right')]),
                    m('button.header-block.nav-close', {
                        onclick() {
                            vnode.state.focusMission('close');
                        },
                    }, [trans(data.strings.close), ' ', icon('close')]),
                ]),
                m('button.header-block.start-overlay', {
                    className: vnode.state.focused_mission === -1 ? ' active' : '',
                    onclick() {
                        vnode.state.focusMission(0);
                    },
                }, [icon('magic'), ' ', trans(data.strings.launch_wizard)]),
            ]),
            m('.scoreboard__warnings', output.warnings.map(
                warning => {
                    let warning_data = null;

                    if (data.warnings.hasOwnProperty(warning)) {
                        warning_data = data.warnings[warning];
                    } else {
                        warning_data = data.warnings.unknown;
                    }

                    return m('.scoreboard__warning', {
                        onclick() {
                            if (warning_data.mission) {
                                const index = data.missions.findIndex(mission => mission.number === warning_data.mission);

                                if (index !== -1) {
                                    vnode.state.focusMission(index);
                                }
                            }
                        },
                    }, trans(warning_data).replace('%warning%', warning));
                }
            )),
            m('.scoreboard__field', {
                className: vnode.state.focused_mission !== -1 ? ' --overlay-open' : '',
            }, data.missions.map(
                (mission, key) => m(FieldMission, {
                    mission,
                    key,
                    missions: vnode.state.missions,
                    focusMission: vnode.state.focusMission,
                })
            )),
            m('.scoreboard__overlay', {
                className: vnode.state.focused_mission !== -1 ? ' --open' : '',
            }, data.missions.map(
                (mission, key) => m(OverlayMission, {
                    mission,
                    key,
                    missions: vnode.state.missions,
                    focused_mission: vnode.state.focused_mission,
                })
            )),
            m('.tools', [
                m('ul.locales', Object.keys(data.locales).map(
                    locale => m('li', {
                        key: locale,
                        onclick() {
                            lang.setLang(locale);
                        },
                    }, locale)
                )),
                m('img', {
                    src: Configuration.imagePath + 'hydro-dynamics-logo.png',
                    alt: 'FLL Hydro Dynamics Logo',
                }),
                m('p', trans(data.strings.about)),
                m('p', m('a.btn.twitter.big', {
                    href: (() => {
                        const text = trans(data.strings.twitter.text).replace('%score%', score);
                        const link = 'https://fll-scoreboard-2017.robots-ju.ch/';

                        // Based on the output seen here https://about.twitter.com/fr/resources/buttons#tweet
                        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(link);
                    })(),
                    target: '_blank',
                }, [
                    icon('twitter'),
                    ' ',
                    trans(data.strings.twitter.button),
                ])),
                m('p', m('a.btn.twitter', {
                    href: 'https://twitter.com/RobotsJU',
                    target: '_blank',
                }, [
                    icon('twitter'),
                    ' ',
                    trans(data.strings.twitter.follow).replace('%user%', '@RobotsJU'),
                ])),
                m('button.btn', {
                    onclick() {
                        vnode.state.missions = JSON.parse(JSON.stringify(FllScorer.initialMissionsState));
                    },
                }, trans(data.strings.reset)),
            ]),
        ];
    },
}
