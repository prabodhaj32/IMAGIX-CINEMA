import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Collapse,
  Button,
  Stack,
  Paper,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import {
  Event,
  AccessTime,
  LocationOn,
  ConfirmationNumber,
  ExpandMore,
  ExpandLess,
  Chair,
} from "@mui/icons-material";

const MyBookings = ({ darkMode }) => {
  const [bookings, setBookings] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userBookings");
      if (!stored) return;

      const parsed = JSON.parse(stored);

      const formatted = parsed.map((booking, index) => ({
        id: booking.paymentInfo?.transactionId ?? `BK00${index + 1}`,
        movieTitle: booking.movie?.title ?? "Unknown Movie",
        poster: booking.movie?.poster_path
          ? `https://image.tmdb.org/t/p/w500${booking.movie.poster_path}`
          : "/F1.jpg",
        date:
          booking.showtime?.date ??
          new Date().toISOString().split("T")[0],
        time: booking.showtime?.time ?? "7:30 PM",
        screen: booking.showtime?.screen ?? "Screen 1",
        seats:
          booking.seats?.map((seat) =>
            typeof seat === "object" ? seat.id : seat
          ) ?? [],
        amount: booking.totalPrice ?? 0,
        status: booking.status ?? "Confirmed",
        bookedOn: booking.bookingDate
          ? new Date(booking.bookingDate).toLocaleDateString()
          : new Date().toLocaleDateString(),
        raw: booking,
      }));

      setBookings(formatted);
    } catch (err) {
      console.error("Booking load error:", err);
    }
  }, []);

  const toggleExpand = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const cancelBooking = (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);

    const stored = JSON.parse(localStorage.getItem("userBookings") || "[]");
    const cleaned = stored.filter(
      (b) => b.paymentInfo?.transactionId !== id
    );

    localStorage.setItem("userBookings", JSON.stringify(cleaned));
  };

  const viewTicket = (booking) => {
    setSelectedBooking(booking);
    setTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setTicketModalOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    if (status === "Cancelled") return "error";
    if (status === "Pending") return "warning";
    return "success";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 12,
        px: 3,
        background: darkMode ? "#0a192f" : "#1e3a5f",
      }}
    >
      <Box maxWidth={1000} mx="auto">
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={5}
          textAlign="center"
          sx={{ letterSpacing: 1 }}
        >
          🎟 My Booking History
        </Typography>

        {bookings.map((b) => (
          <Paper
            key={b.id}
            elevation={0}
            sx={{
              position: "relative",
              mb: 5,
              p: 3,
              borderRadius: 4,
              backdropFilter: "blur(15px)",
              background: darkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.4s ease",
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-8px) scale(1.02)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              },

              /* 🎫 Ticket Cut Circles */
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: darkMode ? "#0f0c29" : "#e0eafc",
                top: "50%",
                transform: "translateY(-50%)",
              },
              "&::before": { left: -20 },
              "&::after": { right: -20 },
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {/* Poster */}
              <Grid item>
                <Avatar
                  variant="rounded"
                  src={b.poster}
                  sx={{
                    width: 100,
                    height: 140,
                    borderRadius: 3,
                    boxShadow: 4,
                  }}
                />
              </Grid>

              {/* Info */}
              <Grid item xs>
                <Typography variant="h6" fontWeight="bold">
                  {b.movieTitle}
                </Typography>

                <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                  <Info icon={<ConfirmationNumber />} text={b.id} />
                  <Info icon={<Event />} text={b.date} />
                  <Info icon={<AccessTime />} text={b.time} />
                  <Info icon={<LocationOn />} text={b.screen} />
                </Stack>
              </Grid>

              {/* Right */}
              <Grid item textAlign="right">
                <Chip
                  label={b.status}
                  color={getStatusColor(b.status)}
                  size="small"
                  sx={{ mb: 1 }}
                />

                <Typography fontWeight="bold" fontSize="1.2rem">
                  ₹{b.amount}
                </Typography>

                <IconButton onClick={() => toggleExpand(b.id)}>
                  {openId === b.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Grid>
            </Grid>

            {/* Expand */}
            <Collapse in={openId === b.id}>
              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" gutterBottom>
                    <Chair fontSize="small" /> Seats:
                    <strong>
                      {" "}
                      {b.seats.length ? b.seats.join(", ") : "N/A"}
                    </strong>
                  </Typography>

                  <Typography variant="body2">
                    Booked on: <strong>{b.bookedOn}</strong>
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                  alignItems="flex-end"
                >
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      transition: "0.3s",
                      "&:hover": {
                        background: "#6366f1",
                        color: "#fff",
                      },
                    }}
                    onClick={() => viewTicket(b)}
                  >
                    View Ticket
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 3, px: 3 }}
                    onClick={() => cancelBooking(b.id)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Collapse>
          </Paper>
        ))}
      </Box>

      {/* Ticket Modal */}
      <Modal
        open={ticketModalOpen}
        onClose={closeTicketModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={ticketModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400, md: 450 },
              background: darkMode ? "#1a1a2e" : "#ffffff",
              borderRadius: 4,
              boxShadow: 24,
              overflow: "hidden",
            }}
          >
            {selectedBooking && (
              <>
                {/* Header */}
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    🎬 Booking Details
                  </Typography>
                </Box>

                {/* Content */}
                <Box p={3}>
                  {/* Transaction ID */}
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Transaction ID
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedBooking.id}
                    </Typography>
                  </Box>

                  {/* Movie */}
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      🎭 Movie
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedBooking.movieTitle}
                    </Typography>
                  </Box>

                  {/* Theater */}
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      🏢 Theater
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedBooking.screen}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 Main St, City
                    </Typography>
                  </Box>

                  {/* Date & Time */}
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      📅 Date & Time
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedBooking.date} at {selectedBooking.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      IMAX
                    </Typography>
                  </Box>

                  {/* Seats */}
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      🪑 Seats
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedBooking.seats.length ? selectedBooking.seats.join(", ") : "N/A"}
                    </Typography>
                  </Box>

                  {/* Total Paid */}
                  <Box
                    sx={{
                      background: darkMode ? "rgba(255,255,255,0.05)" : "#f8f9fa",
                      p: 2,
                      borderRadius: 2,
                      textAlign: "center",
                      mt: 3,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Total Paid
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      ₹{selectedBooking.amount}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" justifyContent="center" gap={2} mt={3}>
                    <Button
                      variant="contained"
                      onClick={closeTicketModal}
                      sx={{ borderRadius: 3, px: 4 }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        window.print();
                      }}
                      sx={{ borderRadius: 3, px: 4 }}
                    >
                      Print
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

const Info = ({ icon, text }) => (
  <Box display="flex" alignItems="center" gap={0.5}>
    {icon}
    <Typography variant="body2">{text}</Typography>
  </Box>
);

export default MyBookings;
