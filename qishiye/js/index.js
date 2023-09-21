// 写一个sleep函数方便用于等待
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
let _this;
var t = null;
new Vue({
  el: "#app",
  data() {
    return {
      loadf: false,
      timer: "0000",
      isFocus: false,
      isHover: false,
      searchValue: "",
      advSuggest: [],
      advSearchBoxStyle: {
        height: "auto",
        display: "none",
        opacity: 0,
      },
    };
  },
  methods: {
    onload() {
      this.loadf = true;
      // 图片加载完成时设置
    },
    searchFocus() {
      this.isFocus = true;
    },
    searchBlur() {
      if (this.isFocus) {
        this.advSuggest = [];
        this.isFocus = false;
        this.searchValue = "";
        this.setSearchBoxStyle();
      }
    },
    search(e, adv = false, fanyi = false) {
      if (adv) {
        this.value = e;
      } else {
        e && "value" in e?.target
          ? (e = e.target.value)
          : (e = this.searchValue);
      }
      if (e == "") {
        return;
      }
      this.value = e;
      open(
        (fanyi
          ? "https://fanyi.baidu.com/#en/zh/"
          : "https://cn.bing.com/search?q=") + this.value,
        "_brenk"
      );
    },
    searchinput() {
      // 输入改变时写一个防抖
      if (t !== null) {
        clearTimeout(t);
      }
      t = setTimeout(async () => {
        this.advSuggest = [];
        this.setSearchBoxStyle();
        if (this.searchValue) {
          let url1 = "https://suggestion.baidu.com/su?wd=";
          let url2 = "&cb=";
          let script = document.createElement("script");
          script.src =
            url1 + this.searchValue + url2 + "_this.searchSuggestion";
          script.type = "";
          document.body.appendChild(script);
        }
      }, 300);
    },
    searchSuggestion(data) {
      let scrdom = document.querySelectorAll("script[type]");
      scrdom.forEach((e) => {
        document.body.removeChild(e);
      });
      this.advSuggest = data.s;
      this.setSearchBoxStyle();
    },
    async setSearchBoxStyle() {
      this.advSearchBoxStyle.height = (this.advSuggest.length + 1) * 30 + "px";
      if (this.searchValue) {
        this.advSearchBoxStyle.display = "block";
        await sleep(100);
        this.advSearchBoxStyle.opacity = 1;
      } else {
        this.advSearchBoxStyle.opacity = 0;
        await sleep(100);
        this.advSearchBoxStyle.display = "none";
      }
      // 为什么要这样写？因为先吧元素设为block后再设置透明度才会有动画 隐藏同理
    },
  },
  async mounted() {
    _this = this.loadf = true;
    while (true) {
      if (this.loadf) {
        this.timer = friendlyDate(Date.now(), {
          locale: "zh",
          threshold: [0, 0],
          format: "hh:mm",
        }).split(":");
        // 获得时间并拆分成数组
        break;
        // 跳出循环
      }
      await sleep(0);
      // 一点要加要不然写死循环会卡住
      // 不知道为什么要用await
    }
    setInterval(() => {
      this.timer = friendlyDate(Date.now(), {
        locale: "zh",
        threshold: [0, 0],
        format: "hh:mm",
      }).split(":");
    }, 1000);
    // 每分钟设置一次时间
  },
});
