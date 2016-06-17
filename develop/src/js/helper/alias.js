export default {
  getId: el => {
    const ret = document.getElementById(el);
    return ret;
  },
  getTag: el => {
    const ret = document.getElementsByTagName(el);
    return ret;
  }
};
