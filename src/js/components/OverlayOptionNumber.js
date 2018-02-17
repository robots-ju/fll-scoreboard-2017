import m from 'mithril';
import OverlayImageGallery from './OverlayImageGallery';
import trans from '../helpers/trans';

export default {
    view(vnode) {
        const option = vnode.attrs.option;
        const missions = vnode.attrs.missions;

        let inputs = [];

        for (let number = 0; number <= option.max; number++) {
            inputs.push(m('.number', {
                className: missions[option.handle] == number ? ' active' : '',
                onclick() {
                    missions[option.handle] = number;
                },
            }, [
                m('.digit', number),
                m('.points', (option.points > 0 ? '+' : '') + (option.points * number)),
            ]));
        }

        return m('label.options', [
            m('.field-box', {
                className: missions[option.handle] ? ' active' : '',
            }, [
                m(OverlayImageGallery, {
                    images: option.images,
                }),
                m('.description', [
                    m('span.title', trans(option.title)),
                    m('span.points', (option.points > 0 ? '+' : '') + option.points),
                ]),
                m('.numbers-input', inputs),
            ]),
        ]);
    },
}
