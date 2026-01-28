#ifndef LRU_CACHE_H
#define LRU_CACHE_H

#include <list>
#include <unordered_map>

template<typename K, typename V>
class LRUCache {
    size_t capacity;
    std::list<std::pair<K,V>> items;
    std::unordered_map<K, typename std::list<std::pair<K,V>>::iterator> mapIt;
public:
    explicit LRUCache(size_t cap=100) : capacity(cap) {}
    bool get(const K& key, V& value) {
        auto it = mapIt.find(key);
        if (it == mapIt.end()) return false;
        items.splice(items.begin(), items, it->second);
        value = it->second->second;
        return true;
    }
    void put(const K& key, const V& value) {
        auto it = mapIt.find(key);
        if (it != mapIt.end()) {
            it->second->second = value;
            items.splice(items.begin(), items, it->second);
            return;
        }
        if (items.size() >= capacity) {
            auto last = items.back();
            mapIt.erase(last.first);
            items.pop_back();
        }
        items.emplace_front(key, value);
        mapIt[key] = items.begin();
    }
    void clear() { items.clear(); mapIt.clear(); }
};

#endif // LRU_CACHE_H
