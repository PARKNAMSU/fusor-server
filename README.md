# fuser-server

### dynamodb local 설치

```
docker run -d -p 8000:8000 amazon/dynamodb-local
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
