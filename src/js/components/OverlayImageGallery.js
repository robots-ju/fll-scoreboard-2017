import m from 'mithril';

export default {
    view(vnode) {
        return m('.images', vnode.attrs.images.map(
            (image, key) => m('.image', {
                key,
                style: {
                    backgroundImage: 'url(assets/' + image + ')',
                },
            })
        ));
    },
}
