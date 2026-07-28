# [Tous Les Jours] 디자인 분석표

## 확인한 자료

- 디자인 원본: [https://www.figma.com/design/63lBMetYrQDQO6Z2QZRUTj/%EA%B0%95%EC%9D%80%EC%84%9C?node-id=796-3228&m=dev]
- 확인한 화면: [홈, 상세, 검색 등]
- 실제 에셋 위치: [assets/images]

## 화면 목록

| 화면 | 목적 | 주요 행동 | 필요한 상태 |
| 메인페이지 | 기존 웹사이트의 난잡한 디자인, 부족했던 정보량 문제를 보완하기 위해 뚜레쥬르 브랜드만의 인기 제품, 신제품을 메인에 노출시키고 홈페이지 쇼핑몰도 섹션에 노출시켜 쇼핑몰 유입률을 늘립니다. 또한 창업 준비자들의 브랜드 신뢰도를 위해 창업 안내 ui 디자인 수정, 보완을 진행합니다.  | gnb 메뉴 클릭 , 제품 섹션 이동, 이벤트 배너 클릭, 신제품/인기제품 카데고리 클릭, 창업 안내 버튼 클릭 | 기본·로딩·빈 상태·오류 
<!-- | [화면명] | [사용자가 해결할 일] | [클릭·입력·이동] | [기본·로딩·빈 상태·오류] | -->

## 공통 영역

- 헤더: [뚜레쥬르 로고, gnb 메뉴, gnb hover시 밑줄 생성, 검색 버튼, 마이페이지 버튼, nav버튼]
- 푸터: [이용메뉴, 개인정보, 브랜드 sns 링크, Copyright, 회사 정보, 패밀리 사이트]
- 공통 버튼: [기본, hover, focus, disabled, border-radius,padding, 색상 ]
- 공통 카드: [Best_product, 푸터, h2, 버튼, arrow 등]

## 디자인 토큰

- 배경색: [ #F3F5E7, #FFFBEA , #181C18 , #637263 , #A1A688 , #4F5D4F]
- 본문색: [ #aaa, #0B2E0A]
- 강조색: [ #134D10, #2F6C2C, #4B8C48, #FF8448, #E5F793, #000000,]
- 제목 폰트: [영문: Montserrat 700]
- 본문 폰트: [Pretendard 400]
- 기본 간격: [8px 기반으로 구현]
- 라운드: [30px]
- 그림자: [#5D5D5D]

## 반응형

- 390px: [한 열 배치, 숨김 또는 이동하는 요소]
- 1024px: [태블릿 배치]
- 1920px: [데스크톱 최대 폭과 열 구성]

## 인터랙션

- 메뉴: [열기·닫기·현재 위치]
- 버튼: [hover·pressed·disabled]
- 스크롤: [디자인에 실제로 있는 동작만 기록]
- 애니메이션: [대상·시작 조건·종료 상태]

## 에셋

- 로고: [assets/images]
- 이미지: [assets/images]
- 아이콘: [assets/images/icon]
- 폰트: [폰트
- Pretendard
- https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css
폰트
- Montserrat
- https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap]

## 확인된 사실

- [메인 컬러는 #134D10이다.
헤더는 스크롤 후에도 상단에 고정된다.
제품 카드는 hover 효과가 있다.]

## 아직 확인하지 못한 내용

- [로딩 화면 디자인이 없다.
빈 검색 결과 화면이 없다.
hover 시간이 명시되어 있지 않다.
focus 상태가 없다.]