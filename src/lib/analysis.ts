import type { AnalysisResult, SymptomInput } from "@/types/health";
import { findEmergencySignals } from "./emergency";

export function buildMockAnalysis(input: SymptomInput): AnalysisResult {
  const emergencyMatchedSignals = findEmergencySignals(input);

  if (emergencyMatchedSignals.length > 0) {
    return {
      urgency: "EMERGENCY",
      summary: "입력하신 증상에 응급 위험 신호가 포함되어 즉시 의료기관의 도움이 필요할 수 있습니다.",
      possibleCauses: [
        {
          name: "응급 평가가 필요한 상태",
          reason: "일부 증상은 빠른 평가와 처치가 필요한 신호일 수 있습니다."
        }
      ],
      recommendedDepartments: [
        {
          name: "응급의학과",
          reason: "응급 위험 신호가 있어 가까운 응급실 또는 119 상담이 우선입니다."
        }
      ],
      selfCare: ["혼자 이동하지 말고 주변 사람에게 도움을 요청하세요.", "가능하면 119에 전화해 현재 증상을 설명하세요."],
      warningSigns: emergencyMatchedSignals,
      medicineSearchKeywords: [],
      emergencyMatchedSignals
    };
  }

  const symptomText = input.symptoms + " " + (input.extraDescription ?? "");
  const isPainful = input.painLevel >= 7;
  const hasRespiratory = /기침|목|호흡|콧물|가래|인후/.test(symptomText);
  const hasDigestive = /복통|설사|구토|속|소화|메스꺼/.test(symptomText);
  const hasEye = /눈|안구|시야|이물감/.test(symptomText);
  const hasJoint = /관절|허리|발목|무릎|손목|염좌|부기/.test(symptomText);

  const department = hasEye
    ? { name: "안과", reason: "눈의 피로, 이물감, 시야 관련 증상은 안과 상담이 적절할 수 있습니다." }
    : hasDigestive
      ? { name: "내과", reason: "복부나 소화기 증상은 내과에서 기본 평가를 받을 수 있습니다." }
      : hasJoint || input.trauma
        ? { name: "정형외과", reason: "외상, 관절 통증, 부기 등은 근골격계 평가가 필요할 수 있습니다." }
        : { name: "내과", reason: "발열, 기침, 전신 증상은 내과에서 원인 평가를 시작할 수 있습니다." };

  return {
    urgency: input.fever || isPainful ? "URGENT" : hasRespiratory || hasDigestive || hasJoint || hasEye ? "ROUTINE" : "SELF_CARE",
    summary: `${input.onset}부터 ${input.affectedArea} 부위에 "${input.symptoms}" 증상이 있으며 통증 정도는 ${input.painLevel}/10입니다.`,
    possibleCauses: [
      {
        name: hasRespiratory ? "상기도 감염 또는 인후 자극 가능성" : hasDigestive ? "소화기 자극 또는 위장관 문제 가능성" : hasJoint ? "염좌 또는 근육/관절 손상 가능성" : "일시적 컨디션 저하 가능성",
        reason: "입력한 증상의 위치, 시작 시점, 동반 증상을 바탕으로 참고용 가능성을 정리했습니다."
      },
      {
        name: "생활 습관 또는 환경 요인 가능성",
        reason: "수면, 활동량, 스트레스, 최근 음식이나 약물 복용 등이 증상에 영향을 줄 수 있습니다."
      }
    ],
    recommendedDepartments: [
      department,
      {
        name: "가정의학과",
        reason: "여러 증상이 섞여 있거나 진료과 선택이 애매할 때 1차 상담에 적합합니다."
      }
    ],
    selfCare: [
      "충분한 휴식을 취하고 수분을 섭취하세요.",
      "증상의 변화와 체온을 기록해 진료 시 의료진에게 알려주세요.",
      "증상이 악화되거나 새 위험 신호가 생기면 의료기관을 방문하세요."
    ],
    warningSigns: ["호흡곤란, 심한 흉통, 의식 저하가 생길 때", "고열이 지속되거나 통증이 빠르게 악화될 때", "혈변, 반복 구토, 심한 탈수 증상이 있을 때"],
    medicineSearchKeywords: hasRespiratory ? ["아세트아미노펜", "이부프로펜", "기침"] : hasDigestive ? ["제산제", "소화제", "전해질"] : ["아세트아미노펜", "소염진통제"]
  };
}
