export interface EmergencySignal {
  id: string;
  label: string;
  patterns: string[];
  description: string;
}

export const emergencySignals: EmergencySignal[] = [
  {
    id: "severe-chest-pain",
    label: "심한 흉통",
    patterns: ["심한 흉통", "흉통", "가슴 통증", "가슴이 짓눌", "가슴 압박", "쥐어짜"],
    description: "가슴을 조이는 듯한 통증이 지속되는 경우"
  },
  {
    id: "dyspnea",
    label: "호흡곤란",
    patterns: ["호흡곤란", "숨이 안", "숨쉬기 힘", "숨이 차", "숨 막"],
    description: "말하기 어려울 정도로 숨이 차거나 쌕쌕거리는 경우"
  },
  {
    id: "altered-mental-status",
    label: "의식 저하",
    patterns: ["의식 저하", "의식이 흐", "실신", "깨워도", "혼미"],
    description: "의식이 흐려지거나 실신 기운이 있는 경우"
  },
  {
    id: "one-sided-weakness",
    label: "갑작스러운 한쪽 마비",
    patterns: ["한쪽 마비", "편마비", "한쪽 힘이", "팔 다리 힘", "얼굴 한쪽"],
    description: "갑자기 한쪽 팔다리에 힘이 빠지는 경우"
  },
  {
    id: "speech-difficulty",
    label: "말하기 어려움",
    patterns: ["말하기 어려", "말이 어눌", "발음이 이상", "말이 안"],
    description: "말이 어눌해지거나 단어가 잘 나오지 않는 경우"
  },
  {
    id: "severe-bleeding",
    label: "심한 출혈",
    patterns: ["심한 출혈", "피가 멈추", "과다 출혈", "많이 피"],
    description: "압박해도 멈추지 않는 출혈이 있는 경우"
  },
  {
    id: "seizure",
    label: "경련",
    patterns: ["경련", "발작", "몸을 떨", "거품"],
    description: "갑작스러운 경련이나 발작이 있는 경우"
  },
  {
    id: "anaphylaxis",
    label: "아나필락시스 의심",
    patterns: ["아나필락시스", "전신 두드러기", "입술 부음", "목이 부", "알레르기 쇼크"],
    description: "전신 알레르기 반응과 호흡 불편이 동반되는 경우"
  },
  {
    id: "self-harm",
    label: "자살 또는 자해 위험",
    patterns: ["자살", "자해", "죽고 싶", "해치고 싶", "극단적 선택"],
    description: "자해 또는 자살 위험을 표현하는 경우"
  }
];
