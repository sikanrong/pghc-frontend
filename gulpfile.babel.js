import gulp from "gulp";
import {bundleVendor, bundleApp} from "./gulp/webpack";
import express from "express";

gulp.task('webpack', async () => {
    await bundleVendor();
    await bundleApp(true);
});

gulp.task('start-server', async () => {
    const app = express();
    app.listen(3000, () => {
        app.use('/', express.static('app'));
    });
});