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

### uhhhh what's BMS?

Someone has already done a great job explaining this one [here](https://github.com/wcko87/beatoraja-english-guide/wiki/BMS-Overview).

#### TLDR 

BMS is a pretty old but still pretty popular Rhythm game file format. However, due to its main-stream "obscurity" & age; It can be extremely difficult to start playing the popular charts most people play. This is mostly due to the reasons listed above.

There are [great resources](https://github.com/wcko87/beatoraja-english-guide) for getting a client that can play BMS set up and running. I even made an [AUR Package](https://aur.archlinux.org/packages/lr2oraja) for one. However, unless you're in some invite only communities or are ok with scouring the web, it takes quite some time to actually *play **fun** songs*. Most new players bounce here.

## Updates

Updates will likely be posted on my [Mastodon](https://mastodon.pfy.ch/@pfych).  
This project can also be discussed on the [forum](https://forum.pfy.ch/viewtopic.php?t=6).

