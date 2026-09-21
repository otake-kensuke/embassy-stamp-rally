const GUIDE_COMMENT_TEMPLATES = {
  complete: {
    man: ({ day }) => `Day ${day} コンプリート！`,
    woman: () => "今日もたくさん歩いたね！"
  },
  added: {
    man: ({ nextName }) => `${nextName}も寄ってみよう！`,
    woman: () => "予定外の発見も街歩きの楽しみだね！"
  },
  almost: {
    man: ({ remaining }) => `基本ルートはあと${remaining}件！`,
    woman: () => "ひと息入れながら進もう！"
  },
  next: {
    man: ({ nextName }) => `次は${nextName}だね！`,
    woman: ({ area }) => `${area}の街も楽しみながら行こう！`
  },
  start: {
    man: ({ day }) => `Day ${day}を始めよう！`,
    woman: ({ area }) => `${area}をのんびり歩こう！`
  }
};

function getGuideComments(context) {
  let key = "start";
  if (context.complete) key = "complete";
  else if (context.addedNext) key = "added";
  else if (context.remaining > 0 && context.remaining <= 3) key = "almost";
  else if (context.nextName) key = "next";
  const template = GUIDE_COMMENT_TEMPLATES[key];
  return {
    man: template.man(context),
    woman: template.woman(context)
  };
}
