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
        id:
          booking?.paymentInfo?.transactionId ||
          `BK-${Date.now()}-${index}`,
        movieTitle: booking?.movie?.title || "Unknown Movie",
        poster: booking?.movie?.poster_path
          ? `https://image.tmdb.org/t/p/w500${booking.movie.poster_path}`
          : "/F1.jpg",
        date:
          booking?.showtime?.date ||
          new Date().toISOString().split("T")[0],
        time: booking?.showtime?.time || "7:30 PM",
        screen: booking?.showtime?.screen || "Screen 1",
        seats:
          booking?.seats?.map((seat) =>
            typeof seat === "object" ? seat.id : seat
          ) || [],
        amount: booking?.totalPrice || 0,
        status: booking?.status || "Confirmed",
        bookedOn: booking?.bookingDate
          ? new Date(booking.bookingDate).toLocaleDateString()
          : new Date().toLocaleDateString(),
      }));

      setBookings(formatted);
    } catch (err) {
      console.error("Booking load error:", err);
    }
  }, []);

  const toggleExpand = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const cancelBooking = (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );

    setBookings(updated);

    localStorage.setItem("userBookings", JSON.stringify(updated));
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
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Box maxWidth={1200} mx="auto">

        {/* HEADER */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background:
                "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🎟 My Booking History
          </Typography>
        </Box>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <Paper
            elevation={6}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              No Bookings Yet
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Start exploring movies and book your first show!
            </Typography>
          </Paper>
        ) : (
          bookings.map((b) => (
            <Paper
              key={b.id}
              elevation={6}
              sx={{
                mb: 4,
                p: 4,
                borderRadius: 4,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Grid container spacing={3} alignItems="center">

                {/* Poster */}
                <Grid item>
                  <Avatar
                    variant="rounded"
                    src={b.poster}
                    sx={{
                      width: 110,
                      height: 150,
                      borderRadius: 3,
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

                {/* Right Side */}
                <Grid item textAlign="right">
                  <Chip
                    label={b.status}
                    color={getStatusColor(b.status)}
                    size="small"
                  />

                  <Typography fontWeight="bold" mt={1}>
                    ₹{b.amount}
                  </Typography>

                  <IconButton onClick={() => toggleExpand(b.id)}>
                    {openId === b.id ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Grid>
              </Grid>

              {/* EXPAND SECTION */}
              <Collapse in={openId === b.id} timeout="auto">
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      Seats:{" "}
                      <b>
                        {b.seats.length
                          ? b.seats.join(", ")
                          : "N/A"}
                      </b>
                    </Typography>
                    <Typography>
                      Booked on: <b>{b.bookedOn}</b>
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    display="flex"
                    justifyContent="flex-end"
                    gap={2}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedBooking(b);
                        setTicketModalOpen(true);
                      }}
                    >
                      View Ticket
                    </Button>

                    {b.status !== "Cancelled" && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          cancelBooking(b.id)
                        }
                      >
                        Cancel
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Collapse>
            </Paper>
          ))
        )}
      </Box>

      {/* MODAL */}
      <Modal
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={ticketModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 450,
              bgcolor: "background.paper",
              borderRadius: 4,
              p: 4,
              boxShadow: 24,
            }}
          >
            {selectedBooking && (
              <>
                <Typography variant="h5" fontWeight="bold">
                  🎬 Ticket Details
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography>
                  Movie: <b>{selectedBooking.movieTitle}</b>
                </Typography>
                <Typography>
                  Date:{" "}
                  <b>
                    {selectedBooking.date} at{" "}
                    {selectedBooking.time}
                  </b>
                </Typography>
                <Typography>
                  Seats:{" "}
                  <b>
                    {selectedBooking.seats.join(", ")}
                  </b>
                </Typography>
                <Typography>
                  Total Paid: <b>₹{selectedBooking.amount}</b>
                </Typography>

                <Box mt={3} display="flex" gap={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      setTicketModalOpen(false)
                    }
                  >
                    Close
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => window.print()}
                  >
                    Print
                  </Button>
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
