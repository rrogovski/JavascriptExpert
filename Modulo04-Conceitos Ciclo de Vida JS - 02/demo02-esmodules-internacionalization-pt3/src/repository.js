import { writeFile, readFile } from 'fs/promises'

export const save = async (data) => {
    // es module não tem __filename, __dirname
    const { pathname: databaseFile } = new URL('./../database.json',  import.meta.url)
    // console.log('Meta url => ', import.meta.url)
    // console.log('databaseFile => ', databaseFile)
    // console.log('databaseFile regex => ', databaseFile.replace(/%20/gi,' '))
    const pathNormalized = databaseFile.replace(/%20/gi,' ')

    if(process.platform === 'win32')
        pathNormalized = pathNormalized
        
    const currentData = JSON.parse(await readFile(pathNormalized))
    currentData.push(data)

    await writeFile(pathNormalized, JSON.stringify(currentData))
}