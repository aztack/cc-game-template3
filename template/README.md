# {{ name }}

{{ description }}

# Set environment variable CCBIN

- `Mac: export CCBIN=/Applications/CocosCreator.app/Contents/MacOS/CocosCreator`
- `Win: set CCBIN=c:\\CocosCreator\\CocosCreator.exe`

# Start development

`npm start` or `npm run dev`

# Build

`npm run build`

# Send built files to device (Android)

`npm run send [-- targetDirectoryOnDevice]`

This command will let you navigate through `/storage/emulated/0/Android/data/<packageName>` on your device,
and copy builded files into selected folder. (packageName is read from `settings/builder.json` if `targetDirectoryOnDevice` is not provide )

# Pack

`npm run pack` and then select platform build to be packed