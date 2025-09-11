import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Pagination = ({ page, totalPages, onPageChange }) => {
  let pages = [];
  const maxVisible = 5;

  const startPage = Math.max(2, page - 1);
  const endPage = Math.min(totalPages - 1, page + 1);

  // nút đầu tiên
  pages.push(
    <TouchableOpacity
      key={1}
      onPress={() => onPageChange(1)}
      style={[styles.pageButton, page === 1 && styles.pageActive]}
    >
      <Text style={[styles.pageText, page === 1 && styles.pageTextActive]}>1</Text>
    </TouchableOpacity>
  );

  if (startPage > 2) {
    pages.push(<Text key="dots1" style={styles.pageDots}>…</Text>);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <TouchableOpacity
        key={i}
        onPress={() => onPageChange(i)}
        style={[styles.pageButton, page === i && styles.pageActive]}
      >
        <Text style={[styles.pageText, page === i && styles.pageTextActive]}>{i}</Text>
      </TouchableOpacity>
    );
  }

  if (endPage < totalPages - 1) {
    pages.push(<Text key="dots2" style={styles.pageDots}>…</Text>);
  }

  if (totalPages > 1) {
    pages.push(
      <TouchableOpacity
        key={totalPages}
        onPress={() => onPageChange(totalPages)}
        style={[styles.pageButton, page === totalPages && styles.pageActive]}
      >
        <Text style={[styles.pageText, page === totalPages && styles.pageTextActive]}>
          {totalPages}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 12 }}>
      <TouchableOpacity
        onPress={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        style={[styles.navButton, page === 1 && { opacity: 0.5 }]}
      >
        <Text>«</Text>
      </TouchableOpacity>

      {pages}

      <TouchableOpacity
        onPress={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        style={[styles.navButton, page === totalPages && { opacity: 0.5 }]}
      >
        <Text>»</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  // Pagination Styles
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "white",
  },
  pageActive: {
    backgroundColor: "#FF6B00",
  },
  pageText: {
    color: "#FF6B00",
  },
  pageTextActive: {
    color: "white",
  },
  pageDots: {
    alignSelf: "center",
    marginHorizontal: 4,
    color: "#666",
  },
  navButton: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
})
export default Pagination;