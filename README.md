# BMS-Zip

Traverse your BMS folder & then create archives based on tables provided.

*This project has only been tested on linux & macOS.*

## Configure

Update the path in `src/config.ts` to point to your BMS directory

```ts
export const BMS_PATH = path.join('/', 'mnt', 'Kachow', 'BMS');
```

Your BMS folder should be structured like the following:

```
BMS/
├ foo/
│ └ foo.bms
├ bar/
│ └ bar.bmson
└ baz/
  └ baz.bme
```

Update the tables array in `src/config.ts` to include the tables you wish to archive
```ts
export const tables = [
  'http://bmsnormal2.syuriken.jp/table.html',
  'https://stellabms.xyz/sl/table.html',
];
```

## Caveats & things to fix

- Only parses one directory deep
- Fetches table data every run
- Will recreate archives if charts haven't changed

## Why

I'll eventually be footing the bill for hosting + a server to automatically run this script once every day or two with the goal of making the normal2 table & satellite table easily downloadable with the focus being on download speed & reliability.

Existing packs currently suffer from one or more of the following issues:

- Lag behind tables by periods longer than a month
- Hosted on services with download quotas &/ bandwidth limiters
- Hosted on a non-intuitive webpage

I am hoping by leveraging AWS Infrastructure I can host a fast & reliable pack host at a low-medium cost. Which for now, with my estimations, I am comfortable footing the bill for.

## Updates

Updates will likely be posted on my [Mastodon](https://mastodon.pfy.ch/@pfych).  
This project can also be discussed on the [forum](https://forum.pfy.ch/viewtopic.php?t=6).
