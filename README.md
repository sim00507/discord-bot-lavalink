# Discord Bot with Lavalink

Lavalink를 이용한 Discord 봇 구현 및 학습 프로젝트</br>

## 시작하기

### 사전 준비

다음 항목들이 설치되어 있는지 확인:

- Node.js (권장 버전: v14.x 이상)
- TypeScript
- Lavalink 서버 (로컬 또는 원격 실행)

### 설치 방법

1. **레포지토리 클론:**
```bash
git clone https://github.com/sim00507/discord-bot-lavalink.git
cd discord-bot-lavalink
```
2. **패키지 설치**
```bash
npm install
```
3. **`.env` 환경 변수 설정**
자세한 사항은 [Lavalink 공식 문서](https://github.com/Tomato6966/lavalink-client/tree/main) 참고
```bash
DISCORD_TOKEN=디스코드-봇-토큰
CLIENT_ID=디스코드-클라이언트-ID
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
LAVALINKNODES=lavalink://USA_1:your_lavalink_password@localhost:2333
```

## 사용법
CommonJS 방식으로 실행
```bash
npx ts-node index.ts
```

## Lavalink 공식 문서
Lavalink 설정 및 API 사용에 대한 자세한 내용은 아래의 공식 문서를 참조</br>
[Lavalink Github](https://github.com/lavalink-devs/Lavalink)</br>
[Lavalink 홈페이지](https://lavalink.dev/)


## 사용한 플러그인
[youtube-source](https://github.com/lavalink-devs/youtube-source)</br>
[LavaSrc](https://github.com/topi314/LavaSrc)</br>
[LavaSearch](https://github.com/topi314/LavaSearch)</br>


## 로그

### 2024-09-27
- 봇 구동까지 완료.
- 명령어 구현하면 됨.
- 플러그인: [LavaSrc](https://github.com/topi314/LavaSrc)

### 2024-09-28
- 필요한 명령어 구현 완료.
- 플러그인 모두 적용 완료.