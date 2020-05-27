# GraphQL

> GrqphQL이란?
> 기존 REST API 단점을 극복하고 효율성을 개선하기 위해 페이스북에서 개발한 쿼리 언어(Query Language)

## 왜 GraphQL인가?

- 모든 데이터(API)가 **하나의 그래프(graph)**로 연결되어 있으며 쿼리를 통해 특정 데이터만 반환 가능
- 기존의 REST API는 요청 수에 따른 엔드 포인트가 존재하지만 GraphQL은 단 하나의 엔드 포인트만 존재
- 쿼리에 맞는 데이터를 정확하게 리턴하기 때문에 REST API의 가장 큰 문제점을 근본적으로 해결

*※ 엔드포인트는 쉽게 얘기해서 API 요청 경로, 즉 url이라고 할 수 있음*

## REST API의 단점

### Over Fetching

- 필요한 데이터 외에도 별도의 불필요한 데이터까지 함께 반환되는 것
- REST API의 가장 근본적인 문제점이며 서버에 과부하를 초래함
- ex) 유저의 이름만 필요한데 API 요청 시 성별, 나이, 닉네임, 아이디 등의 부수 정보까지 반환받는 경우

### Under Fetching

- 얻고자 하는 목적 데이터를 하나의 API로 얻지 못하고 여러 개의 API를 호출해야 하는 경우,
  하나의 API로는 목적 데이터보다 부족한 데이터를 반환받는 것
- ex) 특정 유저가 쓴 글의 상세 정보를 조회하기 위해,
  유저 정보를 반환하는 API를 호출해서 해당 유저가 쓴 글의 번호를 조회하고,
  그 번호로 다시 해당 글의 상세 정보를 반환하는 API를 호출하게 되는 것

### 무수한 엔드 포인트

- 프런트 엔드에서 데이터가 요구되는 기능을 만들 때마다 백 엔드에서 그에 맞는 API를 만들어야 함
- 버전 관리를 하게 되면 각각의 버전에 따른 엔드 포인트가 배로 증가하기 때문에
  프로젝트 규모가 클 수록 유지 보수하기가 굉장히 어려워짐

## 실습 프로젝트 생성

> movieql폴더 생성 후 필요한 패키지 설치

```bash
$ yarn init
$ yarn graphql-yoga
```

### graphql-yoga

> GraphQL 서버를 쉽게 구축할 수 있게 도와주는 라이브러리
> https://github.com/prisma-labs/graphql-yoga

```javascript
import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolvers";

const server = new GraphQLServer({
  typeDefs: "graphql/schema.graphql",
  resolvers,
});

server.start(() => console.log("GraphQL Server Running"));
```

- graphql-yoga만 설치해도 GraphQL 서버 구축 가능
- 위의 코드처럼 간단하게 서버를 띄울 수 있으며 기본적으로 4000번 포트에서 구동
- 4000번 포트로 접속하면 GraphQL 서버와 상호작용할 수 있는 PlayGround 사용 가능
- node.js에서 import 문을 사용하기 위해서는 아래와 같은 패키지 설치와 스크립트의 수정이 필요
- `yarn add ~ --dev` 옵션을 사용하면 개발 의존성으로 패키지 설치 가능

```json
{
  // ...
  "dependencies": {
    "graphql-yoga": "^1.18.3"
  },
  "scripts": {
    "start": "nodemon --exec babel-node index.js"
  },
  "devDependencies": {
    "babel-node": "^0.0.1-security",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-3": "^6.24.1"
  }
}
```

## Schema

> 사용자에게 보내거나 사용자로부터 받을 데이터에 대한 설명

```typescript
// graphql/schema.graphql

type Movie {
  id: Int!
  name: String!
  score: Int!
}

type Query {
  movies: [Movie]!
  movie(id: Int!): Movie
}

type Mutation {
  addMovie(name: String!, score: Int!): Movie!
  deleteMovie(id: Int!): Boolean!
}
```

- 타입 키워드를 이용해서 데이터(객체) 형식과 쿼리, 뮤테이션에 대해 정의
- 데이터 타입에 대해서는 해당 타입이 갖는 값들에 대한 자료형 정의
- 쿼리와 뮤테이션에서는 매개변수 타입과 반환값 타입 정의
- ! (느낌표)는 not null, isRequired와 같이 값을 반드시 필요로 함을 뜻함
- [] (대괄호)는 자료형이 배열임을 뜻함

### Query

> 데이터베이스에서 데이터를 조회할 때만 사용

```typescript
// 정의
type Query {
  movies: [Movie]!
  movie(id: Int!): Movie
}

// 사용예
query {
  movies {
    name
    score
    id
  }
}

// 반환값
{
  "data": {
    "movies": [
      {
        "name": "Logan",
        "score": 5,
        "id": 1
      },
      {
        "name": "LaLa Land",
        "score": 10,
        "id": 2
      }
    ]
  }
}
```

### Mutation

> 데이터베이스의 데이터를 입력, 수정, 삭제할 때 사용

```typescript
// 정의
type Mutation {
  addMovie(name: String!, score: Int!): Movie!
  deleteMovie(id: Int!): Boolean!
}

// PlayGround 사용예
mutation {
  addMovie(name: "Garden of Words", score: 10){
    name
  }
}

// 반환값
{
  "data": {
    "addMovie": {
      "name": "Garden of Words"
    }
  }
}
```

## resolvers

> query는 Database에게 문제 같은 것이기 때문에 리졸버를 통해서 해당 쿼리를 resolve(해결)해야 함
> 다시 말해서, 위에서 정의하기만 해서는 쿼리나 뮤테이션을 사용할 수 없기 때문에 그것을 사용할 수 있도록 하는 리졸버를 작성해야 함

```javascript
import { addMovie, getMovies, getById, deleteMovie } from "./db";

const resolvers = {
  Query: {
    movies: () => getMovies(),
    movie: (_, { id }) => getById(id),
  },
  Mutation: {
    addMovie: (_, { name, score }) => addMovie(name, score),
    deleteMovie: (_, { id }) => deleteMovie(id),
  },
};

export default resolvers;
```

- 리졸버는 쿼리와 뮤테이션으로 정의했던 함수들의 실질적인 사용을 나타냄
- GraphQL 서버를 가동할 때 typeDefs와 더불어 반드시 resolvers가 반드시 필요
- 첫 번째 매개변수는 루트 Query의 이전 객체로 거의 사용되지 않기 때문에 _(언더바)로 표현
- 두 번째 매개변수에 실질적인 인수들이 들어감
- 세 번째 매개변수는 context로 현재 로그인한 사용자, 데이터베이스 액세스와 같은 중요한 문맥 정보를 보유

[참고: https://graphql-kr.github.io/learn/execution/]

## GraphQL로 REST API 감싸기

> GraphQL에서도 REST API를 통해 데이터를 받아올 수 있음

```javascript
const API_URL = "https://yts.am/api/v2/list_movies.json?";
import fetch from "node-fetch";

export const getMovies = (limit, rating) => {
  let REQUEST_URL = API_URL;
  if (limit > 0) {
    REQUEST_URL += `limit=${limit}`;
  }
  if (rating > 0) {
    REQUEST_URL += `&minimum_rating=${rating}`;
  }
  return fetch(REQUEST_URL)
    .then((res) => res.json())
    .then((json) => json.data.movies);
};
```

- node-fetch, axios 등의 라이브러리 사용 가능
- 리졸버 함수 내부에서 API 요청 후 목표 데이터 반환

