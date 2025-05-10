// ~/composables/api/movies/useGetListMovieSections.ts
import { ref, computed } from 'vue'
import { movieSections, type MovieSectionConfig } from '~/config/movieSection'
import { useGetListMovie } from './use-get-list-movie'

export const useGetListMovieSections = () => {
  const paramsRefs: Record<string, Ref<Record<string, string | number | boolean>>> = {}
  const results: Record<MovieSectionConfig['key'], ReturnType<typeof useGetListMovie>> = {} as any

  movieSections.forEach((sec: any) => {
    const paramsRef = ref({ ...sec.params })
    paramsRefs[sec.key] = paramsRef
    results[sec.key] = useGetListMovie(paramsRef)
  })

  const isLoading = computed(
    () => movieSections.some((sec: any) => results[sec.key].isLoading)
  )

  return { movieSections, results, isLoading }
}
