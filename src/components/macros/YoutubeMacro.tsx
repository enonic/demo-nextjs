import type {MacroProps} from '@enonic/nextjs-adapter';
import React from 'react'

const YoutubeMacro = ({name, config, meta}: MacroProps) => {
    const url = typeof config.url === 'string' ? config.url : undefined;
    const title = typeof config.title === 'string' ? config.title : undefined;
    return <iframe width="560" height="315" src={url} title={title} frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
    </iframe>
};

export default YoutubeMacro;
