/* eslint-disable @typescript-eslint/no-explicit-any */

import { sanityClient } from "./sanityClient";
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)

function sanityImgUrl(source: any){
    return builder.image(source)
}

export default sanityImgUrl