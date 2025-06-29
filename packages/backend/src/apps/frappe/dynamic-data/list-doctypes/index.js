import { getDocumentAPIBase } from "../../common/utils.js";

export default {
    name: 'List DocTypes',
    key: 'listDoctypes',

    async run($) {
        const doctypes = {
            data: [],
        };

        const params = new URLSearchParams({
            limit: 10000,
            order_by: 'name',
        });

        const { data } = await $.http.get(`${getDocumentAPIBase($, "DocType")}?${params.toString()}`); // DocType is also a Doctype!
        doctypes.data = data.data.map(doctype => ({name: doctype.name, value: doctype.name}));

        return doctypes;
    }
}