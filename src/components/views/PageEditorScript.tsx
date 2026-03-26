'use client';

import {RENDER_MODE} from '@enonic/nextjs-adapter';

import '@enonic/page-editor/styles.css';
import {useLayoutEffect} from 'react';

const PageEditorScript = function ({mode}: { mode: RENDER_MODE }) {
    useLayoutEffect(() => {
        if (mode === RENDER_MODE.EDIT) {
            // TODO: change to static import after jquery is removed (ssr fails now)
            // because of dynamic import it gets init too late and misses the event from CS
            import('@enonic/page-editor').then(({PageEditor, EditorEvents}) => {
                PageEditor.init();
                console.info('Page editor started.');
            })
        }
    })
    return null;
};

export default PageEditorScript;
