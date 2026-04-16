export const formatLabel = (value = '') => {
    return value.replace(/\b\w/g, (char) => char.toUpperCase())
}