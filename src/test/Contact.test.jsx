import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("@emailjs/browser", () => ({
  default: { send: vi.fn() },
}));

import emailjs from "@emailjs/browser";
import Contact from "../components/Contact";

const fillIn = (container) => {
  fireEvent.change(screen.getByPlaceholderText("What's your good name?"), {
    target: { name: "name", value: "Jamie Rivers" },
  });
  fireEvent.change(screen.getByPlaceholderText("What's your web address?"), {
    target: { name: "email", value: "jamie@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("What you want to say?"), {
    target: { name: "message", value: "Can you build us a booking system?" },
  });
  return container.querySelector("form");
};

describe("Contact form", () => {
  beforeEach(() => {
    emailjs.send.mockReset();
  });

  // The P1 regression. This used to set status "success" in the catch block as
  // well as the try, so a visitor whose message never left the browser was
  // told it had arrived — and the form was cleared, taking the text with it.
  it("reports a real failure when the send throws, and keeps what was typed", async () => {
    emailjs.send.mockRejectedValue(new Error("network down"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(<Contact />);
    fireEvent.submit(fillIn(container));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/didn't send/i);
    });

    expect(screen.queryByText(/Message sent/i)).toBeNull();

    // Nothing the visitor wrote may be discarded.
    expect(screen.getByPlaceholderText("What's your good name?")).toHaveValue(
      "Jamie Rivers"
    );
    expect(screen.getByPlaceholderText("What's your web address?")).toHaveValue(
      "jamie@example.com"
    );
    expect(screen.getByPlaceholderText("What you want to say?")).toHaveValue(
      "Can you build us a booking system?"
    );
  });

  it("offers a mailto fallback carrying the message", async () => {
    emailjs.send.mockRejectedValue(new Error("network down"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(<Contact />);
    fireEvent.submit(fillIn(container));

    const link = await screen.findByRole("link", { name: /email it to me/i });
    const href = decodeURIComponent(link.getAttribute("href"));

    expect(href).toMatch(/^mailto:yousafadnan998@gmail.com\?/);
    expect(href).toContain("Can you build us a booking system?");
    expect(href).toContain("Jamie Rivers");
  });

  it("confirms and clears only on an actual send", async () => {
    emailjs.send.mockResolvedValue({ status: 200 });

    const { container } = render(<Contact />);
    fireEvent.submit(fillIn(container));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/Message sent/i);
    });

    expect(screen.getByPlaceholderText("What's your good name?")).toHaveValue("");
    expect(screen.getByPlaceholderText("What you want to say?")).toHaveValue("");
  });
});
