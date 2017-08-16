# API

## Install

yarn add @entria/api


## Usage

```jsx
try {
    const data = await api({
       url: 'https://example.com/users',
       method: 'GET',
    };
catch (err) {
   console.log('not ok', err);
}
```
