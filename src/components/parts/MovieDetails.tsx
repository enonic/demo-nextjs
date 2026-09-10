import React from 'react';
import type { ImageUrl, PageUrl } from '@enonic/nextjs-adapter';
import {
    APP_NAME_UNDERSCORED,
    I18n,
    MetaData,
    PartProps,
    imageUrl,
    imageUrlQuery,
    pageUrl,
    pageUrlQuery,
} from '@enonic/nextjs-adapter';
import Link from 'next/link';


export const getMovie = `
query {
  guillotine(siteKey: $siteKey, branch: $branch, project: $project) {
    get(key: $path) {
      type
      displayName
      parent {
        _path
        ${pageUrlQuery()}
      }
      ... on ${APP_NAME_UNDERSCORED}_Movie {
        data {
          subtitle
          abstract
          trailer
          release
          photos {
            ... on media_Image {
              ${imageUrlQuery({ scale: 'width(500)' })}
              attachments {
                name
              }
            }
          }
          cast {
            character
            actor {
              ... on ${APP_NAME_UNDERSCORED}_Person {
                _path
                ${pageUrlQuery()}
                displayName
                data {
                  photos {
                    ... on media_Image {
                      ${imageUrlQuery({ scale: 'block(200,200)' })}
                      attachments {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;


// Root component
const MovieView = (props: PartProps) => {
    const data = props.data?.get.data as MovieInfoProps;
    const meta = props.meta;
    const {displayName, parent} = props.data.get;
    const href = pageUrl(parent?.pageUrl, meta);
    return (
        <>
            <div>
                <h2>{displayName}</h2>
                {data && <MovieInfo {...data} meta={meta}/>}
                {data?.cast && <Cast cast={data.cast} meta={meta}/>}
            </div>
            {href &&
             <p>
                 <Link href={href} data-content-path={parent?._path}>{I18n.localize('back')}</Link>
            </p>
            }
        </>
    );
};

export default MovieView;

interface MovieInfoProps {
    meta: MetaData;
    release: string;
    subtitle: string;
    abstract: string;
    cast: CastMemberProps[],
    photos: {
        imageUrl: ImageUrl;
    }[];
}

// Main movie info: release year, poster image and abstract text.
const MovieInfo = (props: MovieInfoProps) => {
    const posterSrc = imageUrl((props.photos || [])[0]?.imageUrl);
    return (
        <>
            {props.release && (
                <p>({new Date(props.release).getFullYear()})</p>
            )}
            {posterSrc && (
                <img src={posterSrc}
                     title={props.subtitle}
                     alt={props.subtitle}
                />
            )}
            <p>{props.abstract}</p>
        </>
    )
}

interface CastProps {
    cast: CastMemberProps[];
    meta: MetaData;
}

interface CastMemberProps {
    character: string;
    actor: {
        _path: string;
        pageUrl: PageUrl;
        displayName: string;
        data: {
            photos: {
                imageUrl: ImageUrl;
                attachments: {
                    name: string
                }[]
            }[]
        }
    }
}

// List persons starring in the movie.
const Cast = (props: CastProps) => (
    <div>
        <h4>Cast</h4>
        <ul style={{listStyle: "none", display: "flex", flexFlow: "row wrap"}}>
            {props.cast.map(
                (person: CastMemberProps, i: number) => person && (
                    <CastMember key={i} {...person} meta={props.meta}/>
                )
            )}
        </ul>
    </div>
);


const CastMember = (props: CastMemberProps & { meta: MetaData }) => {
    const { character, actor } = props;
    const { displayName, pageUrl: actorPageUrl, data, _path } = actor;
    const photoSrc = imageUrl((data.photos || [])[0]?.imageUrl);

    return (
        <li style={{marginRight: "15px"}}>
            {
                photoSrc &&
                <img src={photoSrc}
                     title={`${displayName} as ${character}`}
                     alt={`${displayName} as ${character}`}/>
            }
            <div>
                <p>{character}</p>
                <p>
                    <Link href={pageUrl(actorPageUrl, props.meta)} data-content-path={_path}>
                        {displayName}
                    </Link>
                </p>
            </div>
        </li>
    );
}
