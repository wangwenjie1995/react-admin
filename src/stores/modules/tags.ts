import { create } from 'zustand'
import type { RouteObject } from '@/router/types'
import type { TagsState } from '@/stores/types'
import { persist } from 'zustand/middleware'

const useTagsStore = create<TagsState>()(
  persist(
    (set, get) => ({
      visitedTags: [],
      cachedTags: new Set(),

      addVisitedTags: (tag) => {
        set((state) => {
          const hasExistIndex = state.visitedTags.findIndex(t => t.path === tag.path)
          if (hasExistIndex < 0) {
            return { visitedTags: [...state.visitedTags, tag] }
          }
          const updatedTags = [...state.visitedTags]
          updatedTags[hasExistIndex] = { ...updatedTags[hasExistIndex], ...tag }
          return { visitedTags: updatedTags }
        })
      },

      updateVisitedTags: (tags) => {
        set({ visitedTags: tags })
      },

      closeTagsByType: (type, path) => {
        set((state) => {
          let restTags: RouteObject[] = []
          const { visitedTags } = state
          const tagIndex = visitedTags.findIndex(tag => tag.fullPath === path)
          const affixTags = visitedTags.filter(tag => tag?.meta?.affix)

          switch (type) {
            case 'left':
              restTags = visitedTags.slice(tagIndex)
              break
            case 'right':
              restTags = visitedTags.slice(0, tagIndex + 1)
              break
            case 'other':
              restTags = visitedTags.filter(tag => tag.fullPath === path)
              break
          }
          return { visitedTags: [...affixTags, ...restTags.filter(tag => !tag.meta?.affix)] }
        })
      },

      updateCacheTags: () => {
        set((state) => {
          const cachedSet = new Set<string>()
          state.visitedTags.forEach(tag => {
            if (tag.meta?.keepAlive) {
              cachedSet.add(tag.name!)
            }
          })
          return { cachedTags: cachedSet }
        })
      },

      clearCacheTags: () => {
        set({ cachedTags: new Set() })
      },

      closeTagByKey: async (path) => {
        const { visitedTags, updateVisitedTags } = get()
        const tagIndex = visitedTags.findIndex(tag => tag.fullPath === path)
        const restTags = visitedTags.filter(tag => tag.fullPath !== path)
        updateVisitedTags(restTags)
        return { tagIndex, tagsList: restTags }
      },

      closeAllTags: async () => {
        const { visitedTags, updateVisitedTags } = get()
        const restTags = visitedTags.filter(tag => tag?.meta?.affix)
        updateVisitedTags(restTags)
        return restTags
      }
    }),
    {
      name: 'menu-storage',
    }
  )
)

export default useTagsStore
