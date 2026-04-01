import {Context, PartProps, VariablesGetterResult, GlobalVariables, getUrl} from '@enonic/nextjs-adapter';
import Link from 'next/link';
import React from 'react'

const FORBIDDEN_TYPES_REGEXP = "^media:.*|portal:fragment|portal:template-folder|portal:page-template$";

const ChildList = (props: PartProps) => {
    const {data, meta} = props;
    const children = data.get.children;
    if (!children || children.length === 0) {
        return null;
    }

    return (
        <main style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0 1.0875rem`,
        }}>
            {
                children &&
                <ul>{
                    children.map((child: any, i: number) => (
                        <li key={i}>
                            <Link href={getUrl(child._path, meta)} data-content-path={child._path}>{child.displayName}</Link>
                        </li>
                    ))
                }</ul>
            }
        </main>
    );
};

export default ChildList;

export const getChildList = {
    query: function (vars: GlobalVariables, context?: Context, config?: any): string {
        return `query($order: String) {
              guillotine(siteKey: $siteKey, branch: $branch, project: $project) {
                getSite {
                  displayName
                }
                get(key: $path) {
                  displayName
                  children(sort: $order, first: 50) {
                      _path
                      _id
                      displayName
                      type
                  }
                }
              }
            }`
    },
    variables: function (vars: GlobalVariables, context?: Context, config?: any): VariablesGetterResult {
        return {
            ...vars,
            order: config?.sorting
        }
    }
};

export async function childListProcessor(data: any, context?: Context, config?: any): Promise<any> {

    // exclude forbidden types
    data.get.children = data.get.children?.filter((child: any) => !child.type.match(FORBIDDEN_TYPES_REGEXP));

    return data;
}
