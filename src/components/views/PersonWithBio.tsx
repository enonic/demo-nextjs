import React from 'react'
import {FetchContentResult, getUrl, I18n} from '@enonic/nextjs-adapter';
import Link from 'next/link';
import RichTextView from '@enonic/nextjs-adapter/views/RichTextView';
import styles from './PersonWithBio.module.css';

const PersonWithBio = (props: FetchContentResult) => {
    const {displayName, data, parent} = props.data?.get as any;
    const {bio, photos} = data;
    const meta = props.meta;

    return (
        <>
            <div className={styles.person}>
                <h2>{displayName}</h2>
                <RichTextView className={styles.bio} data={bio} meta={meta}></RichTextView>
                {
                    photos.length && <h4 className={styles.photosheader}>Photos</h4>
                }
                <div className={styles.photos}>
                    {
                        photos.map((photo: any, i: number) => (
                            <img key={i}
                                 src={getUrl(photo.imageUrl, meta)}
                                 title={getTitle(photo, displayName)}
                                 alt={getTitle(photo, displayName)}
                                 width="500"
                            />
                        ))
                    }
                </div>
            </div>
            <p><Link href={getUrl(parent._path, meta)}>{I18n.localize('back')}</Link></p>
        </>
    )
}

export default PersonWithBio;

function getTitle(photo: any, displayName: string) {
    return (photo.attachments || [])[0].name || displayName;
}
