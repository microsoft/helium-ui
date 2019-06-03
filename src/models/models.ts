export type Movie = {
    id: string,
    movieId: string,
    type: string, 
    title: string,
    textSearch: string, 
    year: string, 
    runtime: number,
    genres: string[], 
    roles: string[],
    key: string,
}
  
export type Genre = {
    id: string,
    name: string,
}
  
export type Actor = {
    id: string,
    name: string,
}
  