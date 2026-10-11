export default function () {
  return {
    newTrace: () => {
      return {
        start: () => {},
        stop: () => {},
      };
    },
  };
}
