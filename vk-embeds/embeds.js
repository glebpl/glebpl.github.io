const container = document.body;
const isTrueGetParam = (v) => v === '1' || v === 'true'

const url = new URL(window.location.href);
const width = url.searchParams.get("w") || 360;
const height = url.searchParams.get("h") || 240;
const source = url.searchParams.get("source") || "vk";
const limit = url.searchParams.get("limit") || 9;
const forceNewEmbed = !url.searchParams.get("noNewEmbed");
const autoplay = isTrueGetParam(url.searchParams.get("autoplay"));
const useLazyLoading = isTrueGetParam(url.searchParams.get("useLazyLoading"));
const domain = url.searchParams.get("domain") || 'vkvideo.ru';
const vkVideosFromUrl = url.searchParams.has("vkVideos") ? url.searchParams.get("vkVideos").split(',') : undefined;

const showTotal = (n) => {
  const div = document.createElement("div");
  div.textContent = "Total: " + n;

  container.append(div);
};

const appendEmbed = (src) => {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.width = width;
  iframe.height = height;
  iframe.allow =
    "autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;";

  if (useLazyLoading) {
    iframe.loading = 'lazy';
  }

  container.append(iframe);
};

const appendVkEmbed = (videoId) => {
  const [oid, vid] = videoId.split("_");
  appendEmbed(
    `https://${domain}/video_ext.php?oid=${oid}&id=${vid}&hd=2${
      forceNewEmbed ? "&force_new_embed=1" : ""
    }${
      autoplay ? "&autoplay=1" : ""
    }`
  );
};

const appendYoutubeEmbed = (videoId) => {
  appendEmbed(`https://www.youtube.com/embed/${videoId}`);
};

const appendRutubeEmbed = (videoId) => {
  appendEmbed(`https://rutube.ru/play/embed/${videoId}/`);
};

const vkVideos = vkVideosFromUrl ?? [
  "-20286388_456240820",
  "-217672812_456239405",
  "-203654344_456239686",
  "-217672812_456239413",
  "-217672812_456239210",
  "-217672812_456239217",
  "-217672812_456239138",
  "-217672812_456239219",
  "-217672812_456239122",
  "-217672812_456239273",
  "-217672812_456239407",
  "-217672812_456239178",
  "-217672812_456239126",
  "-217672812_456239177",
  "-69606939_456239162",
  "-69606939_456239166",
  "-69606939_456239209",
  "-23712274_456241196",
  "-203654344_456239378",
  "-203654344_456239430",
  "-217672812_456239406",
  "-203654344_456239979",
  "-110645251_456239497",
  "-220018529_456243294",
  "-220018529_456243267",
  "-222609266_456239453",
  "-224743475_456239114",
  "-222609266_456239408",
  "-222609266_456240770",
  "-222609266_456240915",
  "-176294899_456254363",
  "-176294899_456244292",
  "-176294899_456253620",
  "-69606939_456239209",
  "-220018529_456239663",
  "-222609266_456239803",
  "-110645251_456239816",
  "-176294899_456246929",
  "-176294899_456243085",
  "-176294899_456254562",
  "-176294899_456254551",
  "-176294899_456254422",
  "-145511538_456239138",
  "-145511538_456239131",
  "-145511538_456239139",
  "-145511538_456239096",
  "-145511538_456239140",
  "-145511538_456239141",
  "-145511538_456239142",
  "-145511538_456239154",
  "-145511538_456239141",
];

const rutubeVideos = [
  "8fae99ae28bfd3ba4cdf154632089594",
  "be689a7178c25a1df1e335a0070698db",
  "9a4f4b7b9a14f66324eda35f63e882d4",
  "8809073001759c4e98777d940badb35f",
  "c6c0a695ddae3c18ef50d10c16817ee7",
  "8fdd476c10d6c774db56d79ab64eca77",
  "5ff6201afdd5e91d63f27247fc39cf99",
  "95d5daa567cdd707899b9fb45ea247e1",
  "6dff49f939f01bff4db8ae8f241af178",
  "e7273eab7e8c43196ce17c80f1bd4dd5",
  "e6bb01652353356ca0333f34a957353c",
  "21d1da000a072af2a38fde2d4177f895"
  // 8e4376f33a20247a8fb483c97968c176 - LordR 1.1
];

const youtubeVideos = [
  "qYPVTBIgF7Q",
  "GW8nqjQSzyw",
  "KMFpHpIoQac",
  "hkc4f0aIS4E",
  "gFYvVn3NWSs",
  "IuArgfz7FpQ",
  "C1NQ-0OSMgU",
  "FY5hyIHIKgQ",
  "I8jxR2asjRQ",
  "v7PbeasXUbM",
  "8CYY8EM5xYE",
  "hR-1QGMK75c"
];

if (source === "compare") {
  appendVkEmbed(vkVideos[0]);
  appendRutubeEmbed(rutubeVideos[0]);
  appendYoutubeEmbed(youtubeVideos[0]);
} else {
  const sourceList = source === "rutube" ? rutubeVideos : source === "youtube" ? youtubeVideos : vkVideos;
  const videosToShow = sourceList.slice(0, limit);
  showTotal(videosToShow.length);

  if (source === "vk") {
    videosToShow.forEach(appendVkEmbed);
  } else if (source === "youtube") {
    videosToShow.forEach(appendYoutubeEmbed);
  } else if (source === "rutube") {
    videosToShow.forEach(appendRutubeEmbed);
  }
}
