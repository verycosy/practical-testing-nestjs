# 실용적인 테스트 가이드 (NestJS)

## 1. 소개

[인프런](https://www.inflearn.com/)의 테스트 강의인 [실용적인 테스트 가이드](https://www.inflearn.com/course/practical-testing-%EC%8B%A4%EC%9A%A9%EC%A0%81%EC%9D%B8-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EA%B0%80%EC%9D%B4%EB%93%9C)를 NestJS로 작성한 저장소입니다.
**NestJS에서의 실용적인 테스트**를 함께 논의해보고자 합니다.
(PR 환영합니다!)

## 2. 목차

- VSCode 설정
  - snippet
  - extension
  - shortcut
- Mocking
  - ts-mockito
- TypeORM

  - entitySkipConstructor 적용
  - transformer 파헤치기
    - @js-joda
    - ts-jenum
    - 커스텀 Column
  - 데이터 조회
    - find, FindOperator
    - QueryBuilder
  - typeorm-transactional
  - InMemoryDB

- NestJS 응답 맵핑
