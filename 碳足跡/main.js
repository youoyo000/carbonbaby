// 各行為對應碳分數與專屬建議（含SDGs連結與知識）
const actionDetails = {
  walk: {
    score: -2,
    label: "步行/騎腳踏車上學/上班",
    advice: "你選擇了步行或騎車，完全不產生碳排放，超棒！多利用這樣的方式移動，符合 SDG 13「氣候行動」與 SDG 11「永續城市」目標。",
    sdg: "SDG 13、SDG 11"
  },
  bus: {
    score: -1,
    label: "搭乘大眾運輸",
    advice: "搭乘公車、捷運等大眾運輸，每人平均碳排遠低於汽車，適合日常通勤。這是達成 SDG 13、SDG 11 的好方法！",
    sdg: "SDG 13、SDG 11"
  },
  ac: {
    score: 3,
    label: "今天冷氣開超過2小時",
    advice: "冷氣耗電高、碳排放也多。建議調高溫度到26-28℃、搭配電扇、定期清潔濾網，減少碳足跡。這有助於 SDG 7「可負擔能源」和 SDG 13。",
    sdg: "SDG 7、SDG 13"
  },
  beef: {
    score: 2,
    label: "吃牛肉",
    advice: "牛肉的碳足跡很高（每餐約2600g CO₂e）。可考慮減少紅肉攝取、改吃雞肉或蔬食，對氣候與健康都更好，推動 SDG 12「負責任消費與生產」和 SDG 13。",
    sdg: "SDG 12、SDG 13"
  },
  vegetarian: {
    score: -1,
    label: "一餐吃素",
    advice: "素食餐點碳排較低，減少肉類攝取有助減緩氣候變遷。這是實踐 SDG 13、SDG 12 的好行動！",
    sdg: "SDG 13、SDG 12"
  },
  recycle: {
    score: -1,
    label: "做資源回收",
    advice: "資源回收能減少垃圾掩埋、焚化與原料消耗，進而減碳。持續做好回收，支持 SDG 12「負責任消費與生產」！",
    sdg: "SDG 12"
  },
  plastic: {
    score: 1,
    label: "使用一次性塑膠餐具",
    advice: "一次性塑膠雖然本身碳排不高，但製造、運送和焚化加總起來對地球不友善。建議改用環保餐具，支持 SDG 12 和 SDG 13。",
    sdg: "SDG 12、SDG 13"
  }
};

// 分數等級與角色圖
const resultLevels = [
  {
    min: -99, max: 0,
    img: "assets/character_green.png",
    text: "太棒了！你今天的碳足跡很低～",
  },
  {
    min: 1, max: 2,
    img: "assets/character_normal.png",
    text: "不錯唷，還有進步空間！",
  },
  {
    min: 3, max: 99,
    img: "assets/character_sad.png",
    text: "今天碳足跡偏高喔～",
  }
];

// diary.html 表單送出時，儲存行為到 localStorage 並跳轉
if (document.getElementById('diaryForm')) {
  document.getElementById('diaryForm').addEventListener('submit', function(e){
    e.preventDefault();
    const checked = Array.from(document.querySelectorAll('input[name="actions"]:checked')).map(i => i.value);
    localStorage.setItem('carbonActions', JSON.stringify(checked));
    window.location.href = "result.html";
  });
}

// result.html 顯示精細回饋
if (window.location.pathname.endsWith('result.html')) {
  const checked = JSON.parse(localStorage.getItem('carbonActions') || '[]');
  let score = 0;
  let advices = [];
  let sdgSet = new Set();

  checked.forEach(act => {
    if (actionDetails[act]) {
      score += actionDetails[act].score;
      advices.push(`<li><b>${actionDetails[act].label}：</b>${actionDetails[act].advice}</li>`);
      actionDetails[act].sdg.split('、').forEach(s => sdgSet.add(s.trim()));
    }
  });

  // 找到對應等級
  let level = resultLevels[1];
  for (let item of resultLevels) {
    if (score >= item.min && score <= item.max) {
      level = item;
      break;
    }
  }

  // 顯示角色圖與總分數
  document.getElementById('characterImg').src = level.img;
  document.getElementById('resultText').innerHTML =
    `<strong>${level.text}</strong>（碳分數：${score}）<br>`;

  // 專屬建議清單
  if (advices.length) {
    document.getElementById('suggestionBox').innerHTML =
      `<ul class="advice-list">${advices.join('')}</ul>
       <div class="sdg-tags">
         <span>相關SDG目標：</span>
         ${Array.from(sdgSet).map(sdg => `<span class="sdg">${sdg}</span>`).join('')}
       </div>`;
  } else {
    document.getElementById('suggestionBox').textContent = '請於上一頁勾選你的日常行為！';
  }
}