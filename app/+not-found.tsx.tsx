import { ThemedText } from '@/components/ThemedText';
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import Colors from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <ThemedText style={styles.title}>Page Not Found</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText style={styles.linkText}>Return to Home</ThemedText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  link: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.light.gold,
    borderRadius: 8,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
