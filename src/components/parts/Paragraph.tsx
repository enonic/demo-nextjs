import React from 'react'
import {PartProps} from '@enonic/nextjs-adapter';
import RichTextView from '@enonic/nextjs-adapter/views/RichTextView';

const Paragraph = (props: PartProps) => {
    return (
        <RichTextView data={props.part.config.text} meta={props.meta}/>
    );
};

export default Paragraph;
