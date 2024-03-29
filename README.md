![word_frequency](https://github.com/oyrx/word_frequency/raw/master/others/words.png)
# Word Frequency
A script to analyse the frequencies of words in web pages.  
[Greasyfork](https://greasyfork.org/zh-CN/scripts/371031-%E8%AF%8D%E9%A2%91%E7%BB%9F%E8%AE%A1)  
[Github](https://github.com/oyrx/word_frequency)    
[Blog](https://quoth.win/word_freq)  

## Main Features
- Double-click word to indicate its frequency.  
- Auto analysing words in selected articles.  

## Compatibility
- Tested on [Chrome](https://www.google.com/chrome/) with [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)  

## Known issues
- No pages/elements judgements. 
- <del>No judgement of English at this moment.</del>  
- <del>Might be slow if long passage was selected.</del>  

## TODO
- <del>English judgement</del>  
- <del>Performance</del>  
- Pages/Elements judgements.  

## Demo Gif
![demogif](https://github.com/oyrx/word_frequency/raw/master/others/words.gif)

## Color Indicator
![color](https://github.com/oyrx/word_frequency/raw/master/others/signals.jpg)
    
----------------------------------------------------
    
# 词频脚本
分析网页文章英语词频的油猴脚本  
由于油猴脚本的字符数量限制，建议手动替换  
```var words = ["the",...];```  
一行 为 文件 `COCA_47000` 的五万词频库。  

[在线安装](https://greasyfork.org/zh-CN/scripts/371031-%E8%AF%8D%E9%A2%91%E7%BB%9F%E8%AE%A1)  
[开源地址](https://github.com/oyrx/word_frequency)  
[博客](https://quoth.win/word_freq)  

## 主要功能
- 双击单词自动显示词频范围  
- 选中文章自动分析每一个词语  

## 兼容性
- 安装了 [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) 的 [Chrome浏览器](https://www.google.com/chrome/)   

## 已知问题
- 没有判断网页类型和元素
- <del>暂时没有对英文进行判断</del>  
- <del>受限于JS运行效率，长篇段落比
较慢</del>  

## TODO
- <del>判断英文</del>  
- <del>性能优化</del>  
- 元素判断  

    
## 功能演示
![demogif](https://github.com/oyrx/word_frequency/raw/master/others/words.gif)

## 颜色的含义
![color](https://github.com/oyrx/word_frequency/raw/master/others/signals.jpg)