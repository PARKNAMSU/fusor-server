# fusor (사용자 인증 및 관리 프로젝트)

## ✅ 프로젝트 개요

- **목적**: 외부 파트너 및 오픈 API 제공을 위한 보안 인증 시스템 구축
- **기능 요약**:
    - API Key 발급 및 관리
    - HMAC 기반 Signature 검증
    - timestamp 기반 리플레이 공격 방지
    - 호스트/도메인 기반 호출 제한

## 🔧 기술 스택 및 인프라

| 기술             | 사용 목적               |
| ---------------- | ----------------------- |
| AWS SAM          | 서버리스 인프라 IaC     |
| Lambda           | 비즈니스 로직 실행 함수 |
| API Gateway      | 외부 API Entry Point    |
| DynamoDB         | 서비스 데이터 저장      |
| Redis (Upstash)  | 세션 캐싱, TTL 관리     |
| TypeScript       | 전체 로직 구현          |
| OpenAPI(Swagger) | 문서 자동화             |

## 🏗 아키텍처 다이어그램

todo

## 🔐 인증 처리 흐름

todo

## 🚨 보안 설계 포인트

todo

## ⚙️ 주요 비즈니스 로직

todo

## 💡 트러블슈팅 경험

| 문제                      | 해결 방법                                                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dynaomdb Transaction 사용 | repository 로 각각 함수 실행하면 트랜잭션 적용 어려움 -> custom dynamodb 메서드 생성하여 repository 에서 호출 시 task 배열에 등록 후 트랜잭션 실행 시 배열 에 포함되어있는 테스트 일괄 트랜잭션 처리 |
| Secret 키 저장            | Secrets Manager 비용 이슈 → dynaomdb + 암호화로 대체                                                                                                                                                 |

### dynamodb local 설치

```
docker run -d -p 8000:8000 amazon/dynamodb-local
docker run -d -p 6379:6379 redis
```

### 플랫폼 클라이언트 API KEY 암호화

**조건**

1. 속도가 빨라야하므로 한번 요청으로 처리되어야 함.(재호출 방식x)
2. secretKey 외부 노출 없음
3. 위조 방지
4. 리플레이 불가

**암호화 로직**

1. 클라이언트가 api key 발급 시 api와 hostname 서버에 을 저장한다.
2. 서버(parameter store) 에 hostname 별로 secret key 를 저장한다.
3. 클라이언트는 서버 api 요청 시 apiKey, hostname, timestamp 를 header 에 포함하여 요청한다.
4. 서버에서 전달받은 apiKey, hostname 을 통해 apikey를 검색한 후 매칭되는 apiKey 가 있는경우 (apiKey + hostname + timestamp + secretKe) 조합으로 서명을 생성하여 검증한다.
