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

# React.js + Apollo

> 클라이언트 측에서 React와 Apollo를 이용해서 GraphQL API를 사용하는 방법을 다룸

## 패키지 설치

```bash
$ yarn add styled-components react-router-dom apollo-boost @apollo/react-hooks graphql
```

- styled-components: 컴포넌트 스타일링 라이브러리
- react-router-dom: 리액트에서 사용하는 라우팅 라이브러리
- apollo-boost: 클라이언트에서 GraphQL과 상호작용하기 위해 필요한 모든 설정이 이미 되어 있는 패키지
- @apollo/react-hooks: 아폴로에서 리액트 훅스를 사용하기 위한 라이브러리
- graphql: GraphQL을 사용하기 위한 패키지

## 스타일 초기화

- https://meyerweb.com/eric/tools/css/reset/ 에서 css를 복사해서 public/reset.css 파일을 만들고,
  index.html에서 link 태그로 연결, html 엘리먼트의 기본 스타일을 완전히 초기화하는 데 사용

## 라우팅

> App.js에서 라우팅 설정

```jsx
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import Detail from "../routes/Detail";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:id" component={Detail} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
```

- HashRouter: url에 #를 추가하며, 전체 라우트를 감싸주는 라우터
- Route: 각각의 경로에 대해 렌더링할 컴포넌트 지정
- Switch: Route의 exact 속성 대신 사용할 수 있는 컴포넌트로,
  비교의 기준이 되는 태그를 가장 아래쪽에 배치

## Apollo 초기화

> apollo-boost를 이용해서 아폴로 클라이언트 초기화

### 아폴로 클라이언트 인스턴스 생성

> src/apollo.js 파일 작성

```javascript
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000",
});

export default client;
```

- 아폴로는 단 하나의 엔드포인트를 갖기 때문에 uri에 통신을 원하는 GraphQL API의 주소를 입력
- ApolloProvider에서 사용해야 하기 때문에 export 키워드로 내보냄
- 현재는 로컬 호스트의 4000번 포트에서 작동하기 때문에 해당 uri를 입력

### 아폴로 프로바이더로 리액트 앱 감싸기

> 리액트에서 아폴로를 사용하기 위해 ApolloProvider로 리액트 앱 전체를 감쌈
> src/index.js 파일을 아래와 같이 수정

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./apollo";

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

- ApolloProvider는 @apollo/react-hooks 패키지에서 제공
- 아폴로 프로바이더 컴포넌트로 리액트 앱 전체 감싸기
- 아폴로 프로바이더의 client 속성으로 클라이언트 인스턴스 입력
- 프로젝트를 실행해 보고 개발자 도구의 console, network 탭에 문제가 없다면 성공적으로 연결된 것

## 리액트에서 Query 사용하기

### 매개변수가 없거나 고정된 값을 전달 받는  경우

> 쿼리에 매개변수가 없거나 고정된 값을 입력하는 경우에는 단순하게 쿼리만 작성하면 됨
> src/components/Home.js 코드

```jsx
import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import Movie from "../components/Movie";

// style code ...

const GET_MOVIES = gql`
  query {
    movies(limit: 20, rating: 9) {
      id
      medium_cover_image
    }
  }
`;

export default () => {
  const { loading, data } = useQuery(GET_MOVIES);
  return (
    <Container>
      <Header>
        <Title>React-Apollo 2020</Title>
        <SubTitle>I Love GraphQL</SubTitle>
      </Header>
      {loading && <Loading>Loading...</Loading>}
      {!loading &&
        data.movies &&
        data.movies.map((movie) => <Movie key={movie.id} id={movie.id} />)}
    </Container>
  );
};
```

- 자바스크립트는 자체적으로 GraphQL을 이해하지 못하기 때문에 apollo-boost의 gql 메서드를 사용
- @apollo/react-hooks의 useQuery를 이용해서 gql 메서드로 작성한 쿼리 사용 가능
- 쿼리로 요청한 데이터만 전달 받기 때문에 정확히 필요한 데이터만 받아서 사용할 수 있음

### 매개변수를 동적(variables)으로 전달받는 경우

> Movie.js 에서 Link 태그로 

```jsx
import React from "react";
import { useParams } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const GET_MOVIE = gql`
  query getMovie($id: Int!) {
    movie(id: $id) {
      id
      title_long
      medium_cover_image
      description_full
    }
  }
`;

export default () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_MOVIE, {
    variables: { id: Number(id) },
  });
  if (loading) {
    return "loading";
  }
  if (data && data.movie) {
    return <h1>{data.movie.title_long}</h1>;
  }
};
```

- Apollo가 매개변수의 타입을 검사할 수 있도록 쿼리의 이름과 $ 기호를 사용해서 매개변수를 작성
  *※ GraphQL API에서 정의한 타입과 일치하는 지 확인해야 하기 때문에 타입 검사 실행*
- 쿼리의 이름은 임의로 작성해도 되지만 매개변수의 형식은 GraphQL에서 정의한 형식과 같아야 함
- query { } 내부의 쿼리는 서버로 전송
- $ 기호를 사용한 부분이 useQuery에서 variables로 넘기는 실제 데이터가 들어가는 부분이라고 생각하면 됨

## Cache

> Apollo에는 Cache 기능이 있기 때문에 요청을 자주 보내지 않을 수 있게 됨
> REST와 리덕스를 사용한다면 직접 구현해야 함

## Apollo Client Developer Tools

> 크롬 익스텐션, 캐시와 같은 아폴로 관련 정보를 볼 수 있음

## Local State

> API에서 넘어온 데이터를 수정할 수 있는 기능

### 아폴로 클라이언트에 리졸버 등록

> 아폴로 클라이언트 인스턴스를 생성하는 옵션에 리졸버 추가

```javascript
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  resolvers: {
    Movie: {
      isLiked: () => false,
    },
  },
});

export default client;
```

- resolvers 옵션에 GraphQL API에 등록되어 있는 타입과 동일한 타입에 대해 새로운 필드를 선언하고 그에 대한 리졸버를 등록

### 쿼리에 클라이언트 데이터 설정하기

> 프런트에서 보내는 쿼리에 임의로 추가한 필드가 클라이언트에서 선언한 것이라고 알리기

```javascript
// ...
const GET_MOVIES = gql`
  query {
    movies(sort: "rating") {
      id
      medium_cover_image
      isLiked @client
    }
  }
`;
// ...
```

- 새로 만든 필드 오른쪽에 telegraphq ql인 @client를 작성해서 해당 필드는 클라이언트 측에서 작성한 것이라고 알림
- 프로젝트를 실행해 보면 에러가 발생하지 않는 것을 볼 수 있으며, 아폴로 개발자 도구를 확인해 보면 Movie 타입에 isLiked 라는 필드가 추가된 것을 볼 수 있음

### 로컬 스테이트 Mutation

> 아폴로 클라이언트 리졸버에 Mutation을 등록해서 로컬 스테이트 값을 수정할 수 있음

#### 아폴로 클라이언트 리졸버에 Mutation 등록

```javascript
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  resolvers: {
    Movie: {
      isLiked: () => false,
    },
    Mutation: {
      likeMovie: (_, { id }, { cache }) => {
        cache.writeData({
          id: `Movie:${id}`,
          data: {
            isLiked: true,
          },
        });
      },
    },
  },
});

export default client;
```

- 리졸버에 등록하는 함수의 세 번째 매개변수는 context인데 그 안에 있는 cache를 사용할 수 있음
- writeData를 이용해서 캐쉬에 저장된 데이터를 수정할 수 있음
- 아폴로 개발자 도구에서 캐쉬를 확인해 보면 각 데이터의 아이디가 Movie:12312 와 같이 [타입:아이디] 형식으로 등록된 것을 볼 수 있고, 그에 맞추기 위해 writeData 함수의 옵션 객체의 id 값에 동일한 형식으로 id를 전달
- 옵션 객체의 data의 값으로는 캐쉬에 등록된 Movie 타입이 갖는 모든 필드 사용 가능

#### 컴포넌트에서 Mutation 사용하기

> 리졸버에 등록한 뮤테이션을 컴포넌트에서 사용

```jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const LIKE_MOVIE = gql`
  mutation LikeMovie($id: Int!) {
    likeMovie(id: $id) @client
  }
`;

// style code ...

export default ({ id, bg, isLiked }) => {
  const [likeMovie] = useMutation(LIKE_MOVIE, {
    variables: { id: parseInt(id) },
  });

  return (
    <Container>
      <Link to={`/${id}`}>
        <Poster bg={bg} />
      </Link>
      <span
        style={{ color: "red", cursor: "pointer" }}
        onClick={isLiked ? null : likeMovie}
      >
        {isLiked ? "♥" : "♡"}
      </span>
    </Container>
  );
};
```

- GraphQL 서버에서 매개변수를 동적으로 전달받을 때 작성했던 쿼리 형식과 동일한 형식으로 뮤테이션 작성
- 로컬 스테이트를 등록할 때와 마찬가지로 @client를 표기해서 해당 뮤테이션이 클라이언트에서 이루어진다는 것을 아폴로 클라이언트에 알려야 함
- 뮤테이션을 사용할 때는 @apollo/react-hooks의 useMutation을 사용하며 형식은 useQuery와 동일함
  단, 반환값으로는 뮤테이션을 실행할 수 있는 함수를 반환
- useMutation으로 반환받은 함수를 onClick 함수에 등록
- 프로젝트를 실행하고 ♡를 클릭하면 ♥로 바뀌는 것을 볼 수 있음