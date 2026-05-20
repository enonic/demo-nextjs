'use client';

import {RENDER_MODE, MetaData} from '@enonic/nextjs-adapter';
import {ComponentPath, EditorEvents, PageEditor} from '@enonic/page-editor';

const SINGLE_COMPONENT_MARKER = 'details[data-single-component-output="true"]';

const PageEditorScript = function ({meta: {path, locale, renderMode}}: { meta: MetaData }) {

    if (PageEditor.isInitialized()) {
        return null;
    }

    PageEditor.init({editMode: renderMode === RENDER_MODE.EDIT});
    console.info(`Page editor started in ${renderMode} mode.`);

    PageEditor.on(EditorEvents.ComponentLoadRequest, async (event) => {
        const data = event.getData() as { path?: ComponentPath } | undefined;
        const componentPath = data?.path;
        if (!componentPath) {
            return;
        }

        PageEditor.renderLoadingComponent(componentPath);

        try {
            const url = `/${locale}/${path}/_/component/${componentPath}`.replace(/\/{2,}/g, '/');

            const res = await fetch(url, {credentials: 'same-origin'});
            if (!res.ok) {
                throw new Error(`Component load failed: ${res.status} ${res.statusText}`);
            }

            const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
            const marker = doc.querySelector(SINGLE_COMPONENT_MARKER);
            if (!marker) {
                throw new Error('Single-component marker not found in response');
            }

            PageEditor.renderComponent(componentPath, marker.innerHTML);
        } catch (err) {
            PageEditor.renderErrorComponent(componentPath, err instanceof Error ? err : new Error(String(err)));
        }
    });

    return null;
};

export default PageEditorScript;
