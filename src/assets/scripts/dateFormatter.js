/**
 *
 * @param {Date} date 변환할 Date 객체
 * @returns Date 타입 날짜 객체를 yyyy-MM-dd hh:mm:ss 형식에 변환한 날짜 문자열을 반환합니다.
 */
function getFormatDate (date) {
    const coder = (val) => {
        return val >= 10 ? val : '0' + val
    }

    const year = date.getFullYear()
    const month = coder((1 + date.getMonth()))
    const day = coder(date.getDate())
    const hour = coder(date.getHours())
    const minute = coder(date.getMinutes())
    const second = coder(date.getSeconds())
    return year + '-' + month + '-' + day +
        ' ' + hour + ':' + minute + ':' + second
}

/**
 *
 * @returns 함수 호출 시점 기준 현재 날짜를 나타내는 문자열을 반환합니다.
 */
function now () {
    return getFormatDate(new Date())
}

export { getFormatDate, now }
