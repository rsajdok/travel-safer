import ExtraTags from "./extraTags";

type Details = {
    place_id: number;
    osm_type: string;
    osm_id: number;
    category: string;
    type: string;
    localname: any;
    extratags: ExtraTags;
}

export default Details;