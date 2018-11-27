import gulp from "gulp";
import {bundleVendor, bundleApp} from "./gulp/webpack";

gulp.task('webpack', async () => {
    await bundleVendor();
    await bundleApp(true);
});
