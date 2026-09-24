import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { bestMoneylines, type GameLine } from './odds'

const LEAGUES = { nfl: 'NFL', nba: 'NBA', mlb: 'MLB', nhl: 'NHL', ncaa_football: 'NCAAF' } as const
type League = keyof typeof LEAGUES

const fmt = (p: number | null) => (p == null ? '—' : p > 0 ? `+${p}` : String(p))
const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })

function Side({ side }: { side: GameLine['away'] }) {
  return (
    <View style={styles.side}>
      <Text style={styles.team} numberOfLines={1}>{side.team}</Text>
      <View style={styles.priceBox}>
        <Text style={styles.price}>{fmt(side.price)}</Text>
        {side.book && <Text style={styles.book}>{side.book}</Text>}
      </View>
    </View>
  )
}

export default function App() {
  const [league, setLeague] = useState<League>('nfl')
  const [games, setGames] = useState<GameLine[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      setError(null)
      setGames(await bestMoneylines(league))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [league])

  useEffect(() => { setGames(null); load() }, [load])

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Best odds</Text>
      <View style={styles.chips}>
        {(Object.keys(LEAGUES) as League[]).map((id) => (
          <Pressable key={id} onPress={() => setLeague(id)} style={[styles.chip, id === league && styles.chipOn]}>
            <Text style={[styles.chipText, id === league && styles.chipTextOn]}>{LEAGUES[id]}</Text>
          </Pressable>
        ))}
      </View>
      {error && <Text style={styles.error}>Couldn&apos;t load odds: {error}</Text>}
      {!games && !error ? <ActivityIndicator style={{ marginTop: 40 }} /> : (
        <FlatList
          data={games ?? []}
          keyExtractor={(g) => g.eventId}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false) }} />}
          ListEmptyComponent={<Text style={styles.empty}>No {LEAGUES[league]} games are priced right now.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.time}>{when(item.startTime)} · {item.books} books</Text>
              <Side side={item.away} />
              <Side side={item.home} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f7f5' },
  title: { fontSize: 28, fontWeight: '700', paddingHorizontal: 16, paddingTop: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  chipOn: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  chipText: { fontSize: 14, color: '#1a1a1a' },
  chipTextOn: { color: '#fff' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e0e0e0' },
  time: { fontSize: 12, color: '#777', marginBottom: 6 },
  side: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  team: { fontSize: 16, flex: 1, marginRight: 12 },
  priceBox: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
  book: { fontSize: 11, color: '#777' },
  empty: { textAlign: 'center', color: '#777', marginTop: 40 },
  error: { color: '#b00020', paddingHorizontal: 16 },
})
