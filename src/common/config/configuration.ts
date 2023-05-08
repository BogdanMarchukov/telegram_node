import * as process from "process";

export default () => ({
    token: process.env.TOKEN,
    url: process.env.URL,
});